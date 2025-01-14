import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { NextRequest, NextResponse } from 'next/server';
import { ApiStatus } from '~/constants/ApiConstant';
import { DateTimeConstant } from '~/constants/DateTimeConstant';
import prismadb from '~/lib/prismadb';
import serverAuth from '~/lib/serverAuth';
import { DateTime } from '~/types/date-time';

dayjs.extend(customParseFormat);

export async function GET(req: NextRequest) {
    try {
        const { currentUser } = await serverAuth();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: ApiStatus.UNAUTHORIZED });
        }

        const timerSetting = await prismadb.timerSetting.findUnique({
            where: {
                userId: currentUser.id,
            },
            include: {
                lunchTime: true,
                startWorkingTime: true,
                endWorkingTime: true,
            },
        });

        return NextResponse.json(timerSetting, { status: ApiStatus.SUCCESS });
    } catch (error) {
        console.error('GET: /api/timer-setting', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: ApiStatus.SERVER_ERROR });
    }
}

const formatTime = (time: DateTime) => dayjs(time, DateTimeConstant.HH_MM);

const calcDuration = (end: string, start: string) => {
    const duration = formatTime(end).diff(formatTime(start), 'm');
    return duration;
};

const calcEndWorkingTime = (timeStr: string, workingHours: number, lunchDuration: number) => {
    const time = formatTime(timeStr).add(workingHours, 'h').add(lunchDuration, 'm');
    return time.format(DateTimeConstant.HH_MM);
};

export async function POST(req: NextRequest) {
    try {
        const { currentUser } = await serverAuth();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: ApiStatus.UNAUTHORIZED });
        }

        const body = await req.json();
        const { workingHours, startWorkingTime, lunchTime } = body;

        const upsertInput = {
            workingHours,
            lunchTime: {
                start: lunchTime.start,
                end: lunchTime.end,
                duration: calcDuration(lunchTime.end, lunchTime.start),
            },
            startWorkingTime: {
                start: startWorkingTime.start,
                end: startWorkingTime.end,
                duration: calcDuration(startWorkingTime.end, startWorkingTime.start),
            },
            endWorkingTime: {
                start: '',
                end: '',
                duration: 0,
            },
        };

        upsertInput.endWorkingTime = {
            start: calcEndWorkingTime(
                upsertInput.startWorkingTime.start,
                upsertInput.workingHours,
                upsertInput.lunchTime.duration,
            ),
            end: calcEndWorkingTime(
                upsertInput.startWorkingTime.end,
                upsertInput.workingHours,
                upsertInput.lunchTime.duration,
            ),
            duration: upsertInput.startWorkingTime.duration,
        };


        let timerSetting = await prismadb.timerSetting.findUnique({
            where: {
                userId: currentUser.id,
            },
        });

        timerSetting = await prismadb.timerSetting.upsert({
            where: {
                userId: currentUser.id,
            },
            create: {
                workingHours,
                lunchTime: {
                    create: {
                        ...upsertInput.lunchTime,
                    },
                },
                startWorkingTime: {
                    create: {
                        ...upsertInput.startWorkingTime,
                    },
                },
                endWorkingTime: {
                    create: {
                        ...upsertInput.endWorkingTime,
                    },
                },
                user: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
            update: {
                workingHours,
                lunchTime: {
                    update: {
                        data: {
                            ...upsertInput.lunchTime,
                        },
                    },
                },
                startWorkingTime: {
                    update: {
                        data: {
                            ...upsertInput.startWorkingTime,
                        },
                    },
                },
                endWorkingTime: {
                    update: {
                        data: {
                            ...upsertInput.endWorkingTime,
                        },
                    },
                },
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(timerSetting, { status: ApiStatus.SUCCESS });
    } catch (error) {
        console.error('POST: /api/timer-setting', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: ApiStatus.SERVER_ERROR });
    }
}

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { NextRequest, NextResponse } from 'next/server';
import { ApiStatus } from '~/constants/ApiConstant';
import { DateTimeConstant } from '~/constants/DateTimeConstant';
import prismadb from '~/lib/prismadb';
import serverAuth from '~/lib/serverAuth';
import { DateTime } from '~/types/date-time';

dayjs.extend(customParseFormat);

const formatTime = (time?: DateTime) => dayjs(time, DateTimeConstant.HH_MM);

const calcCheckOutTime = (
    checkInTime: string,
    workingHours: number,
    startWorkingTime?: string,
    lunchDuration?: number,
) => {
    let timeCheckIn = formatTime(checkInTime);

    const isAfterStartTime = formatTime(checkInTime).isAfter(formatTime(startWorkingTime));
    if (!isAfterStartTime) formatTime(startWorkingTime);

    const checkOutTime = timeCheckIn.add(workingHours, 'hour').add(lunchDuration || 0, 'm');

    return checkOutTime.format(DateTimeConstant.HH_MM);
};

export async function POST(req: NextRequest) {
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

        if (!timerSetting) {
            return NextResponse.json({ error: 'No setting found' }, { status: ApiStatus.BAD_REQUEST });
        }

        const body = await req.json();
        const { checkInTime } = body;
        const today = new Date(dayjs().format(DateTimeConstant.YYYY_MM_DD));

        let workingTime = await prismadb.workingTime.findUnique({
            where: {
                userId: currentUser.id,
                date: {
                    equals: today,
                },
            },
        });

        const upsertInput = {
            userId: currentUser.id,
            date: today,
            checkInTime,
            checkOutTime: calcCheckOutTime(
                checkInTime,
                timerSetting.workingHours,
                timerSetting.startWorkingTime?.start,
                timerSetting.lunchTime?.duration,
            ),
        };

        workingTime = await prismadb.workingTime.upsert({
            where: {
                userId: currentUser.id,
                date: {
                    equals: today,
                },
            },
            create: {
                ...upsertInput,
            },
            update: {
                ...upsertInput,
            },
        });

        return NextResponse.json(workingTime, { status: ApiStatus.SUCCESS });
    } catch (error) {
        console.error('POST: /api/working-time', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: ApiStatus.SERVER_ERROR });
    }
}

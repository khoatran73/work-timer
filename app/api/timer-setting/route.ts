import { NextRequest, NextResponse } from 'next/server';
import { ApiStatus } from '~/constants/ApiConstant';
import prismadb from '~/lib/prismadb';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { workingHours, startWorkingTime, lunchTime } = body;
        // const { currentUser } = await serverAuth(req, res);

        const timerSetting = await prismadb.timerSetting.create({
            data: {
                workingHours,
                lunchTime: {
                    create: {
                        start: lunchTime.start,
                        end: lunchTime.end,
                    },
                },
                startWorkingTime: {
                    create: {
                        start: startWorkingTime.start,
                        end: startWorkingTime.end,
                    },
                },
            },
        });

        return NextResponse.json(timerSetting, { status: ApiStatus.SUCCESS });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: ApiStatus.BAD_REQUEST });
    }
}

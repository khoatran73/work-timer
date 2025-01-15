import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { NextRequest, NextResponse } from 'next/server';
import { ApiStatus } from '~/constants/ApiConstant';
import { DateTimeConstant } from '~/constants/DateTimeConstant';
import serverAuth from '~/lib/serverAuth';

dayjs.extend(customParseFormat);

export async function GET(req: NextRequest) {
    try {
        const { currentUser } = await serverAuth();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: ApiStatus.UNAUTHORIZED });
        }

        const workingTime = await prismadb.workingTime.findUnique({
            where: {
                userId: currentUser.id,
                date: {
                    equals: new Date(dayjs().format(DateTimeConstant.YYYY_MM_DD)),
                },
            },
        });

        return NextResponse.json(workingTime, { status: ApiStatus.SUCCESS });
    } catch (error) {
        console.error('GET: /api/working-time/today', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: ApiStatus.SERVER_ERROR });
    }
}

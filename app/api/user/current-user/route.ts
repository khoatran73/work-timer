import { NextRequest, NextResponse } from 'next/server';
import { ApiStatus } from '~/constants/ApiConstant';
import serverAuth from '~/lib/serverAuth';

export async function GET(req: NextRequest) {
    try {
        const { currentUser } = await serverAuth();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: ApiStatus.UNAUTHORIZED });
        }
        return NextResponse.json(currentUser, { status: ApiStatus.SUCCESS });
    } catch (error) {
        console.error('GET: /api/user/current-user', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: ApiStatus.SERVER_ERROR });
    }
}

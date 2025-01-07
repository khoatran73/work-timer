import { Divider } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { ButtonBase } from '~/components/ButtonBase';
import Container from '~/layouts/Container';

const LoginPage: React.FC = () => {
    return (
        <>
            <Container className="flex items-center justify-center">
                <div className="w-[400px] rounded-xl p-4 bg-white shadow">
                    <div className="mb-6">
                        <div className="text-2xl font-bold">Sign In</div>
                    </div>
                    <div className="flex flex-col mb-6">
                        <div className="mb-4">
                            <input
                                type="text"
                                className={clsx(
                                    'block w-full p-2.5 text-sm rounded-lg outline-none',
                                    'focus:border-blue-500 bg-gray-50 border border-gray-300'
                                )}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="password"
                                className={clsx(
                                    'block w-full p-2.5 text-sm rounded-lg outline-none',
                                    'focus:border-blue-500 bg-gray-50 border border-gray-300'
                                )}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <Link href={'/forgot'} className="text-blue-500 hover:underline text-sm">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="mb-2">
                        <ButtonBase
                            variant="primary"
                            title="Sign in"
                            className="h-10 w-full !shadow-none"
                        />
                        <Divider variant="solid" className='!text-gray-500'>or</Divider>
                        <ButtonBase
                            variant="normal"
                            startIcon={<FcGoogle size={24} />}
                            className="h-10 w-full !shadow-none"
                        />
                    </div>
                </div>
            </Container>
        </>
    );
};

export default LoginPage;

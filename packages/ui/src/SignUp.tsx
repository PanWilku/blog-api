type SignUpProps = {
        logoSrc?: string;
        links: string[];
        action?: string;
    };

    export function SignUp({ logoSrc, links, action }: SignUpProps): JSX.Element {
        return (
            <>
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img src={logoSrc} alt="Your Company" className="mx-auto h-20 w-auto" />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Create your account</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form action={action} method="POST" className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Email address</label>
                                <div className="mt-2">
                                    <input id="email" type="email" name="email" required autoComplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
                                <div className="mt-2">
                                    <input id="password" type="password" name="password" required autoComplete="new-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-100">Confirm Password</label>
                                <div className="mt-2">
                                    <input id="confirm-password" type="password" name="confirmPassword" required autoComplete="new-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                                </div>
                            </div>

                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign up</button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-400">
                            Already have an account?
                            <a href={links[0]} className="font-semibold text-indigo-400 hover:text-indigo-300"> Sign in</a>
                        </p>
                    </div>
                </div>
            </>
        )
    }
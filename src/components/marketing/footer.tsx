import Link from "next/link";
import Container from "../global/container";
import Icons from "../global/icons";

const Footer = () => {
    return (
        <footer className="flex flex-col relative items-center justify-center border-t border-foreground/5 pt-8 pb-8 px-6 lg:px-8 w-full max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center w-full">
                <Container>
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2">
                            <Icons.icon className="w-auto h-5" />
                            <span className="text-base md:text-lg font-medium text-foreground">
                                Addrly
                            </span>
                        </div>
                    </div>
                </Container>

                <Container delay={0.5} className="w-full relative mt-8">
                    <div className="flex items-center justify-center footer w-full">
                        <p className="text-sm text-muted-foreground mt-4">
                            &copy; {new Date().getFullYear()} Addrly. All rights reserved.
                        </p>
                    </div>
                </Container>
            </div>
        </footer>
    )
};

export default Footer

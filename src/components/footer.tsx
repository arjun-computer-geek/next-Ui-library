import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t py-6 md:py-8 px-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Acme Inc. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <Link href="#" className="text-sm hover:underline">
                        Terms of Service
                    </Link>
                    <Link href="#" className="text-sm hover:underline">
                        Privacy Policy
                    </Link>
                    <Link href="#" className="text-sm hover:underline">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
} 
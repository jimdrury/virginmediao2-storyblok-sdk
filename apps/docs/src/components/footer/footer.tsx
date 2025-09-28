import Image from "next/image";
import type { FC } from "react";
import logo from "../../../public/virgin-media-o2-logo.svg";

export const Footer: FC = () => {
	return (
		<footer className="bg-black text-white px-4 py-8">
			<div className="container mx-auto space-y-6">
				<nav aria-label="Footer Navigation">
					<ul className="flex flex-wrap gap-6">
						<li>
							<a href="/about" className="text-white text-sm hover:underline">
								About Us
							</a>
						</li>
						<li>
							<a href="/terms" className="text-white text-sm hover:underline">
								Terms & Conditions
							</a>
						</li>
						<li>
							<a href="/privacy" className="text-white text-sm hover:underline">
								Privacy Policy
							</a>
						</li>
						<li>
							<a href="/cookies" className="text-white text-sm hover:underline">
								Cookies Policy
							</a>
						</li>
						<li>
							<a
								href="/modern-slavery"
								className="text-white text-sm hover:underline"
							>
								Modern Slavery Statement
							</a>
						</li>
						<li>
							<a
								href="/accessibility"
								className="text-white text-sm hover:underline"
							>
								Access for all
							</a>
						</li>
						<li>
							<a
								href="/corporate"
								className="text-white text-sm hover:underline"
							>
								Corporate Statements
							</a>
						</li>
					</ul>
				</nav>

				<hr className="border-white" />

				<div className="flex gap-4 items-center ">
					<Image
						src={logo.src}
						width={logo.width}
						height={logo.height}
						alt="Virgin Media O2 Logo"
						className="h-10 w-auto"
						priority
					/>
					<p className="text-sm ">
						© 2025 Virgin Media. All Rights Reserved, © 2025 Telefonica. All
						Rights Reserved
					</p>
				</div>
			</div>
		</footer>
	);
};

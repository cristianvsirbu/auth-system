import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "text";
	fullWidth?: boolean;
	children: ReactNode;
	isLoading?: boolean;
}

export default function Button({
	variant = "primary",
	fullWidth = false,
	children,
	isLoading = false,
	disabled,
	className = "",
	...rest
}: ButtonProps) {
	const baseStyles =
		"px-4 py-2 mb-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variantStyles = {
		primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
		secondary:
			"bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
		text: "bg-transparent text-blue-600 hover:bg-gray-100 focus:ring-blue-500",
	};

	const widthStyles = fullWidth ? "w-full" : "";
	const loadingStyles = isLoading ? "opacity-70 cursor-not-allowed" : "";

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${loadingStyles} ${className}`}
			disabled={isLoading || disabled}
			{...rest}
		>
			{isLoading ? (
				<span className="flex items-center justify-center">
					Loading...
				</span>
			) : (
				children
			)}
		</button>
	);
}

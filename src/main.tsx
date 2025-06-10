import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { setupMockApi } from "./services/mock-service";
import { Toaster } from "react-hot-toast";

setupMockApi();

const rootElement = document.getElementById("root");
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<App />
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
		</React.StrictMode>
	);
} else {
	console.error("Root element not found");
}

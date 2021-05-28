import { resolve } from "path";

export default ({ command, mode }) => {
	return {
		root: "src/",
		base: "/",
		build: {
			outDir: "./../dist",
			emptyOutDir: true,
			rollupOptions: {
				input: {
					main: resolve(__dirname, 'src', 'index.html')
				}
			}
		}
	}
}

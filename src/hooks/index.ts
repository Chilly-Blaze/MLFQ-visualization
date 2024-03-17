export const sleep = (t: number) => {
	return new Promise((r) => setTimeout(r, t * 1000))
}

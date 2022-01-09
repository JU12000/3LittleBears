import { get, writable } from "svelte/store";

const toast = writable([]);

const toastCount = writable(0);

function pop(id) {
	toast.update(x => x.filter(y => y.id !== id));
}

function push(message, append = false) {
	if (append) {
		toast.update(x => [
			{
				id: get(toastCount),
				message: message
			},
			...x
		]);
	}
	else {
		toast.update(x => [
			...x,
			{
				id: get(toastCount),
				message: message
			}
		]);
	}

	toastCount.update(x => x += 1);
}

export default {
	pop,
	push,
	toast,
	toastCount
};

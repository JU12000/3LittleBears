import { get, writable } from "svelte/store";

const toast = writable({
	items: [],
	counter: 0,
	pop: (id) => {
		toast.update(x => {
			return {
				...x,
				items: x.items.filter(y => y.id != id)
			};
		});
	},
	push: (message, append = true) => {
		const item = {
			id: get(toast).counter,
			message: message
		};

		toast.update(x => {
			return {
				items: append ? x.items.push(item) : x.items.unshift(item),
				counter: x.counter++,
				...x
			};
		});
	}
});

export default toast;

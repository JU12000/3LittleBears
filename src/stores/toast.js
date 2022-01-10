import { get, writable } from "svelte/store";

const toast = writable({
	items: [],
	counter: 0,
	pop: (id) => {
		toast.update(x => {
			// Here we have to remove items from the properties of x to handle the edge
			// case where items becomes empty after items.filter and is then overwritten
			// to the old value by the proceeding spread
			// eslint-disable-next-line no-unused-vars
			const {items, ...remainingProperties} = x;
			return {
				items: x.items.filter(y => y.id != id),
				...remainingProperties
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

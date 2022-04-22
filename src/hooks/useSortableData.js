import React from 'react';

const useSortableData = (users, config = null) => {
	const [sortConfig, setSortConfig] = React.useState(config);

	const sortedusers = React.useMemo(() => {
		const sortableusers = [...users];
		if (sortConfig !== null) {
			sortableusers.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableusers;
	}, [users, sortConfig]);

	const requestSort = (key) => {
		let direction = 'ascending';
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	const getClassNamesFor = (key) => {
		if (!sortConfig) {
			return 'd-none';
		}
		// eslint-disable-next-line consistent-return
		return sortConfig.key === key ? sortConfig.direction : 'd-none';
	};

	return { users: sortedusers, requestSort, getClassNamesFor, sortConfig };
};

export default useSortableData;

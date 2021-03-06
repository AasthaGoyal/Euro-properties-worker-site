import * as React from 'react';

function SvgAsterisk(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M8 0a1 1 0 011 1v5.268l4.562-2.634a1 1 0 111 1.732L10 8l4.562 2.634a1 1 0 11-1 1.732L9 9.732V15a1 1 0 11-2 0V9.732l-4.562 2.634a1 1 0 11-1-1.732L6 8 1.438 5.366a1 1 0 011-1.732L7 6.268V1a1 1 0 011-1z' />
		</svg>
	);
}

export default SvgAsterisk;

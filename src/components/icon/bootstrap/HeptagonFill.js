import * as React from 'react';

function SvgHeptagonFill(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path
				fillRule='evenodd'
				d='M7.779.052a.5.5 0 01.442 0l6.015 2.97a.5.5 0 01.267.34l1.485 6.676a.5.5 0 01-.093.415l-4.162 5.354a.5.5 0 01-.395.193H4.662a.5.5 0 01-.395-.193L.105 10.453a.5.5 0 01-.093-.415l1.485-6.676a.5.5 0 01.267-.34L7.779.053z'
			/>
		</svg>
	);
}

export default SvgHeptagonFill;

import * as React from 'react';

function SvgStopwatchFill(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M6.5 0a.5.5 0 000 1H7v1.07A7.001 7.001 0 008 16a7 7 0 005.29-11.584.531.531 0 00.013-.012l.354-.354.353.354a.5.5 0 10.707-.707l-1.414-1.415a.5.5 0 10-.707.707l.354.354-.354.354a.717.717 0 00-.012.012A6.973 6.973 0 009 2.071V1h.5a.5.5 0 000-1h-3zm2 5.6V9a.5.5 0 01-.5.5H4.5a.5.5 0 010-1h3V5.6a.5.5 0 111 0z' />
		</svg>
	);
}

export default SvgStopwatchFill;

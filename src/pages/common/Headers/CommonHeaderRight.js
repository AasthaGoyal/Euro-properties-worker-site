import React, {  useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../../components/bootstrap/Button';
import { HeaderRight } from '../../../layout/Header/Header';

import Dropdown, {
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';


// eslint-disable-next-line react/prop-types
const CommonHeaderRight = ({ beforeChildren, afterChildren }) => {
	const styledBtn = {
		color:  'light',
		hoverShadow: 'default',
		isLight: true,
		size: 'lg',
	};



	const [offcanvasStatus, setOffcanvasStatus] = useState(false);
	return (
		<HeaderRight>
			<div className='row g-3'>
				{beforeChildren}

				
				{/* Quick Panel */}
				<div className='col-auto'>
					<Dropdown >
						<DropdownToggle hasIcon={false}>
							{/* eslint-disable-next-line react/jsx-props-no-spreading */}
							<Button {...styledBtn} icon='Tune' aria-label='Quick menu' />
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg' className='py-0 overflow-hidden'>
							<div className='row g-0'>
								<div
									className={classNames(
										'col-12',
										'p-4',
										'd-flex justify-content-center',
										'fw-bold fs-5',
										'text-info',
										'border-bottom border-info',
                    'bg-l25-info',
									)}>
									Quick Panel
								</div>
								<div
									className={classNames(
										'col-6 p-4 transition-base cursor-pointer bg-light-hover',
										'border-end border-bottom',
									)}>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='Public' size='3x' color='info' />
										<span>Dealers</span>
										<small className='text-muted'>Options</small>
									</div>
								</div>
								<div
									className={classNames(
										'col-6 p-4 transition-base cursor-pointer bg-light-hover',
										'border-bottom',
									)}>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='Upcoming' size='3x' color='success' />
										<span>Inbox</span>
										<small className='text-muted'>Configuration</small>
									</div>
								</div>
								<div
									className={classNames(
										'col-6 p-4 transition-base cursor-pointer bg-light-hover',
										'border-end',
									)}>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='Print' size='3x' color='danger' />
										<span>Print</span>
										<small className='text-muted'>Settings</small>
									</div>
								</div>
								<div className='col-6 p-4 transition-base cursor-pointer bg-light-hover'>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='ElectricalServices' size='3x' color='warning' />
										<span>Power</span>
										<small className='text-muted'>Mode</small>
									</div>
								</div>
							</div>
						</DropdownMenu>
					</Dropdown>
				</div>

			
				{afterChildren}
			</div>

	
		</HeaderRight>
	);
};
CommonHeaderRight.propTypes = {
	beforeChildren: PropTypes.node,
	afterChildren: PropTypes.node,
};
CommonHeaderRight.defaultProps = {
	beforeChildren: null,
	afterChildren: null,
};

export default CommonHeaderRight;

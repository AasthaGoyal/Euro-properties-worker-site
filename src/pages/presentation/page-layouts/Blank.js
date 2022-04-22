import React from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { layoutMenu } from '../../../menu';
import Popovers from '../../../components/bootstrap/Popovers';

const Blank = () => {
	return (
		<PageWrapper title={layoutMenu.blank.text}>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='col-12 d-flex justify-content-center align-items-center'
						style={{ fontSize: 'calc(3rem + 3vw)' }}>
						<Popovers
							title='Blank.js'
							desc={<code>src/pages/presentation/page-layouts/Blank.js</code>}>
							Page
						</Popovers>
						<code className='ps-3'>Blank.js</code>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Blank;

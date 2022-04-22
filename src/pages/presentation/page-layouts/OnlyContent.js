import React from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { layoutMenu } from '../../../menu';
import Popovers from '../../../components/bootstrap/Popovers';

const OnlyContent = () => {
	return (
		<PageWrapper title={layoutMenu.pageLayout.subMenu.onlyContent.text}>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='col-12 d-flex justify-content-center align-items-center'
						style={{ fontSize: 'calc(1rem + 1vw)' }}>
						<Popovers
							title='OnlyContent.js'
							desc={<code>src/pages/presentation/page-layouts/OnlyContent.js</code>}>
							Page
						</Popovers>
						<code className='ps-3'>OnlyContent.js</code>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default OnlyContent;

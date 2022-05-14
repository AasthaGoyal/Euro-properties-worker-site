import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card, { CardBody } from './bootstrap/Card';
import useDarkMode from '../hooks/useDarkMode';
import Button from './bootstrap/Button';
import Icon from './icon/Icon';

const TransferAction = ({ icon, activity_name, jobsite, date, time, status, className, color }) => {
  const { darkModeStatus } = useDarkMode();

  const _status =
    (status === 'Completed' && 'success') ||
    (status === 'Ongoing' && 'info') ;
  return (
    <Card className={className}>
      <CardBody>
        <div className='row g-3 align-items-center'>
          <div className='col d-flex align-items-center'>
            <div className='flex-shrink-0'>
              <div className='ratio ratio-1x1' style={{ width: 72 }}>

                <Icon icon={icon} size='lg' className='me-1' color={color} />

              </div>
            </div>
            <div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
              <div>
                <div className='fw-bold fs-6 mb-0'>{date}</div>
                <div className='fw-bold fs-6 mb-0'>{time}</div>
                <div className='text-muted'>
                  <small>
                    {jobsite}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className='col'>
            <Button

              color={color}
              size='lg'
              isLight data-tour='filter'
            >
              {activity_name}
            </Button>
          </div>
          <div className='col-auto'>
            <div
              className={classNames(
                `bg-l${darkModeStatus ? 'o25' : '10'
                }-${_status} text-${_status} fw-bold px-3 py-2 rounded-pill`,
              )}>
              {status}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
TransferAction.propTypes = {
  currency: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['Completed', 'Processing', 'Failed']).isRequired,
  img: PropTypes.string.isRequired,
  className: PropTypes.string,
  imgWidth: PropTypes.number,
};
TransferAction.defaultProps = {
  className: null,
  imgWidth: 150,
};

export default TransferAction;

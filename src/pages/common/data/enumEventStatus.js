import COLORS from './enumColors';

const EVENT_STATUS = {
	APPROVED: { name: 'Active', color: COLORS.SUCCESS.name },
	CANCELED: { name: 'Inactive', color: COLORS.DANGER.name }
};
export default EVENT_STATUS;

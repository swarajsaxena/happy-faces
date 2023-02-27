import { appId } from "../App";

export const ChannelForm = (props: {
	setInCall: React.Dispatch<React.SetStateAction<boolean>>;
	setChannelName: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const { setInCall, setChannelName } = props;

	return (
		<form className='join'>
			<input
				type='text'
				placeholder='Enter Channel Name'
				onChange={e => setChannelName(e.target.value)}
			/>
			<button
				onClick={e => {
					e.preventDefault();
					setInCall(true);
				}}
			>
				Join
			</button>
		</form>
	);
};

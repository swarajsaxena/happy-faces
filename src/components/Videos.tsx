import {
	AgoraVideoPlayer,
	IAgoraRTCRemoteUser,
	ICameraVideoTrack,
	IMicrophoneAudioTrack,
} from "agora-rtc-react";

export const Videos = (props: {
	users: IAgoraRTCRemoteUser[];
	tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}) => {
	const { users, tracks } = props;

	console.log({ users, tracks });

	return (
		<div id='videos' style={{ width: '70%', margin: '0 auto', height: '100%', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
			<AgoraVideoPlayer
				className='vid'
				videoTrack={tracks[1]}
				style={{ height: '250px', aspectRatio: '3/2', borderRadius: '0.25rem', overflow: 'hidden' }}
			/>
			{users.length > 0 &&
				users.map(user => {
					if (user.videoTrack) {
						return (
							<AgoraVideoPlayer
								className='vid'
								videoTrack={user.videoTrack}
								style={{ height: '250px', aspectRatio: '3/2', borderRadius: '0.25rem', overflow: 'hidden' }}
								key={user.uid}
							/>
						);
					} else return null;
				})}
		</div>
	);
};

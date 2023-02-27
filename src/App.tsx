import React, { useEffect, useState } from "react";
import {
	ClientConfig,
	createClient,
	createMicrophoneAndCameraTracks,
	IAgoraRTCRemoteUser,
} from "agora-rtc-react";

import reactLogo from "./assets/react.svg";
import "./App.css";
import { ChannelForm } from "./components/ChannelForm";
import { Controls } from "./components/Controls";
import { Videos } from "./components/Videos";

export const config: ClientConfig = {
	mode: "rtc",
	codec: "vp8",
};

export const appId: string = "60eb6295ad1b477cbbec89da58d0c6bb";
export const token: string | null =
	"007eJxTYLg6vbqy7vaUJzYlK1+/fa2dutCxkTV700GddWc8bm2u3d+qwGBmkJpkZmRpmphimGRibp6clJSabGGZkmhqkWKQbJaUlN/5J7khkJEhQ+AdCyMDBIL4/AwlqcUlmXnp8ckZiXl5qTkMDAAGkyfO";

export const useClient = createClient(config);

function App() {
	const [inCall, setInCall] = useState(false);
	const [channelName, setChannelName] = useState("");

	return (
		<div className="app">
			<h1 className='heading'>Welcome To Happy Faces</h1>
			{inCall ? (
				<VideoCall setInCall={setInCall} channelName={channelName} />
			) : (
				<ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
			)}
		</div>
	);
}

export default App;

const VideoCall = (props: {
	setInCall: React.Dispatch<React.SetStateAction<boolean>>;
	channelName: string;
}) => {
	const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
	const client = useClient();

	const { setInCall, channelName } = props;
	const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
	const [start, setStart] = useState<boolean>(false);
	const { ready, tracks } = useMicrophoneAndCameraTracks();

	useEffect(() => {
		// function to initialise the SDK
		let init = async (name: string) => {
			console.log("init", name);
			client.on("user-published", async (user, mediaType) => {
				await client.subscribe(user, mediaType);
				console.log("subscribe success");
				if (mediaType === "video") {
					setUsers(prevUsers => {
						return [...prevUsers, user];
					});
				}
				if (mediaType === "audio") {
					user.audioTrack?.play();
				}
			});

			client.on("user-unpublished", (user, type) => {
				console.log("unpublished", user, type);
				if (type === "audio") {
					user.audioTrack?.stop();
				}
				if (type === "video") {
					setUsers(prevUsers => {
						return prevUsers.filter(User => User.uid !== user.uid);
					});
				}
			});

			client.on("user-left", user => {
				console.log("leaving", user);
				setUsers(prevUsers => {
					return prevUsers.filter(User => User.uid !== user.uid);
				});
			});

			await client.join(appId, name, token, null);
			if (tracks) await client.publish([tracks[0], tracks[1]]);
			setStart(true);
		};

		if (ready && tracks) {
			console.log("init ready");
			init(channelName);
		}
	}, [channelName, client, ready, tracks]);

	return (
		<div style={{ width: '100%' }}>
			{ready && tracks && (
				<Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
			)}
			{tracks && <Videos users={users} tracks={tracks} />}
		</div>
	);
};

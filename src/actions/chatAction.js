import FirebaseChat from '../service/firebase_requests/Chat';

const CHAT = 'chat';
export const SET_LOADING = `${CHAT}/SET_LOADING`;
export const ERROR = `${CHAT}/ERROR`;
export const INIT = `${CHAT}/INIT`;
export const CREATE = `${CHAT}/CREATE`;

export const chatInit = (payload) => ({
    type: INIT,
    payload,
});

export const createChat = (payload) => ({
    type: CREATE,
    payload,
});

// export const API_CALL_REQUEST = 'API_REQUEST';
// export const API_CALL_ERROR = 'API_CALL_ERROR';
// export const UPDATE_MESSAGE_LIST = 'UPDATE_MESSAGE_LIST';
// export const UPDATE_SELECTED_MESSAGE = 'UPDATE_SELECTED_MESSAGE';
// export const SET_MESSAGES = 'SET_MESSAGES';
// export const ADD_NEW_ROOM = 'ADD_NEW_ROOM';
// export const SUBSCRIBE_ROOM = 'SUBSCRIBE_ROOM';
// export const DELETE_ROOM = 'DELETE_ROOM';
// export const CURRENT_GROUP = 'CURRENT_GROUP';
// export const SET_CHAT_ROOM_MESSAGES = 'SET_CHAT_ROOM_MESSAGES';
// export const ADD_CHAT_ROOM_MESSAGE = 'ADD_CHAT_ROOM_MESSAGE';
// export const SET_UESR_CHAT_ROOMS = 'SET_UESR_CHAT_ROOMS';
// export const UPDATE_ROOM = 'UPDATE_ROOM';
// export const DELETE_MEMBERS = 'DELETE_MEMBERS';
// export const SET_PUBLIC_FORUM = 'SET_PUBLIC_FORUM';
// export const TOGGLE_MEMBER_PUBLIC_FORUM = 'TOGGLE_MEMBER_PUBLIC_FORUM';
// export const RESET_HISTORY = 'RESET_HISTORY';
// export const GET_CHAT_ROOM_REQUEST = 'GET_CHAT_ROOM_REQUEST';
// export const POLL_UPDATE = 'POLL_UPDATE';

// import chatApi from '../service/firebase_requests/Chat';

// const apiCallRequest = () => ({
//     type: API_CALL_REQUEST,
// });

// const apiCallError = (payload) => ({
//     type: API_CALL_ERROR,
//     payload,
// });

// const updateMessageList = (payload) => ({
//     type: UPDATE_MESSAGE_LIST,
//     payload,
// });

// const updateSelectedMessage = (payload) => ({
//     type: UPDATE_SELECTED_MESSAGE,
//     payload,
// });

// const addNewRoom = (payload) => ({
//     type: ADD_NEW_ROOM,
//     payload,
// });

// const deleteRoom = (payload) => ({
//     type: DELETE_ROOM,
//     payload,
// });

// const updateRoom = (payload) => ({
//     type: UPDATE_ROOM,
//     payload,
// });

// const setUserChatRooms = (payload) => ({
//     type: SET_UESR_CHAT_ROOMS,
//     payload,
// });

// const deleteMembers = (payload) => ({
//     type: DELETE_MEMBERS,
//     payload,
// });

// const setPublicChatRoom = (payload) => ({
//     type: SET_PUBLIC_FORUM,
//     payload,
// });

// const toggleMemberPublicForum = (payload) => ({
//     type: TOGGLE_MEMBER_PUBLIC_FORUM,
//     payload,
// });

// const getChatRoomRequest = () => ({
//     type: GET_CHAT_ROOM_REQUEST,
// });

// const pollUpdate = (payload) => ({
//     type: POLL_UPDATE,
//     payload,
// });

// export const resetHistory = () => ({
//     type: RESET_HISTORY,
// });

// export const subscribeRoom = (payload) => ({
//     type: SUBSCRIBE_ROOM,
//     payload,
// });

// export const currentGroup = (payload) => ({
//     type: CURRENT_GROUP,
//     payload,
// });

// export const setChatRoomMessages = (payload) => ({
//     type: SET_CHAT_ROOM_MESSAGES,
//     payload,
// });

// export const addChatRoomMessage = (payload) => ({
//     type: ADD_CHAT_ROOM_MESSAGE,
//     payload,
// });

// export const sendMessage = (data) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             const res = await chatApi.sendMessage(data);
//             // dispatch(updateMessageList(res.data));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('send message error', err);
//         }
//     };
// };

// export const updateMessage = (id, data) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             await chatApi.updateSelectedMessage(id, data);
//             dispatch(updateSelectedMessage({ id, data }));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('update messsage error', err);
//         }
//     };
// };

// export const getChatRoomMessages = (roomId, count = 10) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             const res = await chatApi.getChatMessgeByRoomId(roomId, count);
//             dispatch(setChatRoomMessages({ messages: res.data.messages, total: res.data.total }));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('get messsage by roomId error', err);
//         }
//     };
// };

// export const createChatRoom = (data) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             const res = await chatApi.createChatRoom(data);
//             dispatch(addNewRoom(res.data));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('create group error', err);
//         }
//     };
// };

// export const getChatRooms = (userId) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             const res = await chatApi.getUserChatRooms(userId);
//             dispatch(setUserChatRooms(res.data.rooms));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('get rooms by userId error', err);
//         }
//     };
// };

// export const getChatRoom = (roomId) => {
//     return async (dispatch) => {
//         try {
//             dispatch(getChatRoomRequest());
//             const res = await chatApi.getChatRoom(roomId);
//             dispatch(currentGroup(res.data?.room));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('get rooms by roomId error', err);
//         }
//     };
// };

// export const deleteChatRoom = (id) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             await chatApi.deleteChatRoom(id);
//             dispatch(deleteRoom(id));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('delete group error', err);
//         }
//     };
// };

// export const updateChatRoom = (id, data) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             await chatApi.updateChatRoom(id, data);
//             dispatch(updateRoom({ id, data }));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('update group error', err);
//         }
//     };
// };

// export const handleDeleteMembers = (roomId, users) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             await chatApi.deleteMembers(roomId, users);
//             dispatch(deleteMembers({ roomId, ...users }));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('delete members error', err);
//         }
//     };
// };

// export const getPublicChatRooms = (userId) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             const res = await chatApi.getPublicChatRooms(userId);
//             dispatch(setPublicChatRoom(res.data.rooms));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('get public group error', err);
//         }
//     };
// };

// export const updatePublicGroup = (roomId, user) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             const res = await chatApi.updatePublicGroup(roomId, user);
//             dispatch(toggleMemberPublicForum({ roomId, members: res.data.members }));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('join group error', err);
//         }
//     };
// };

// export const pollVoted = (params) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             const res = await chatApi.pollVoted(params);
//             dispatch(pollUpdate({ id: res.data.poll.id, poll: res.data.poll.poll }));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('vote error', err);
//         }
//     };
// };

// export const retractVote = (params) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             const res = await chatApi.retractVote(params);
//             dispatch(pollUpdate({ id: res.data.poll.id, poll: res.data.poll.poll }));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('retract vote error', err);
//         }
//     };
// };

// export const toggleLike = (params) => {
//     return async (dispatch) => {
//         try {
//             dispatch(apiCallRequest());
//             const res = await chatApi.toggleLike(params);
//             dispatch(updateSelectedMessage({ id: res.data.messageId, data: { like: res.data.like } }));
//         } catch (err) {
//             dispatch(apiCallError(err));
//             console.log('like error', err);
//         }
//     };
// };

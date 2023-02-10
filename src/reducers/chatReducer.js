import * as CHAT_ACTIONS from '../actions/chatAction';

const initialState = {
    rooms: [],
    loading: false,
    error: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CHAT_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        case CHAT_ACTIONS.ERROR:
            return {
                ...state,
                loading: false,
                error: '',
            };
        case CHAT_ACTIONS.INIT:
            return {
                ...state,
                loading: false,
                error: '',
                rooms: action.payload,
            };
        case CHAT_ACTIONS.CREATE:
            return {
                ...state,
                rooms: [action.payload, ...state.rooms],
            };
        default:
            return state;
    }
};

// import {
//     API_CALL_REQUEST,
//     API_CALL_ERROR,
//     UPDATE_MESSAGE_LIST,
//     UPDATE_SELECTED_MESSAGE,
//     ADD_CHAT_ROOM_MESSAGE,
//     ADD_NEW_ROOM,
//     DELETE_ROOM,
//     UPDATE_ROOM,
//     CURRENT_GROUP,
//     SET_CHAT_ROOM_MESSAGES,
//     SET_UESR_CHAT_ROOMS,
//     DELETE_MEMBERS,
//     SET_PUBLIC_FORUM,
//     TOGGLE_MEMBER_PUBLIC_FORUM,
//     SUBSCRIBE_ROOM,
//     RESET_HISTORY,
//     GET_CHAT_ROOM_REQUEST,
//     POLL_UPDATE,
// } from '../actions/chatAction';

// const initialState = {
//     messages: [],
//     groups: [],
//     publicForums: [],
//     currentGroup: null,
//     error: null,
//     isLoaded: false,
//     isLoading: false,
//     isDeleted: false,
//     isUpdated: false,
// };

// export default (state = initialState, action) => {
//     let messages = [...state.messages];
//     let groups = [...state.groups];
//     let currentGroup = { ...state.currentGroup };
//     const publicForums = [...state.publicForums];
//     switch (action.type) {
//         case API_CALL_REQUEST:
//             return {
//                 ...state,
//                 isLoaded: false,
//                 isLoading: true,
//                 isDeleted: false,
//                 isUpdated: false,
//                 error: null,
//             };
//         case GET_CHAT_ROOM_REQUEST:
//             return {
//                 ...state,
//                 messages: [],
//                 currentGroup: null,
//                 isLoaded: false,
//                 isLoading: true,
//                 isDeleted: false,
//                 isUpdated: false,
//                 error: null,
//             };
//         case API_CALL_ERROR:
//             return {
//                 ...state,
//                 isLoaded: true,
//                 isLoading: false,
//                 error: action.payload,
//             };
//         case UPDATE_MESSAGE_LIST:
//             return {
//                 ...state,
//                 messages: messages.concat(action.payload),
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case UPDATE_SELECTED_MESSAGE:
//             return {
//                 ...state,
//                 messages: messages.map((v) => {
//                     if (v.id === action.payload.id) return { ...v, ...action.payload.data };
//                     else return v;
//                 }),
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case ADD_NEW_ROOM:
//             if (groups.findIndex((group) => group.id === action.payload.id) > -1) groups.concat(action.payload);
//             return {
//                 ...state,
//                 groups: groups,
//                 currentGroup: action.payload,
//                 messages: [],
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case SUBSCRIBE_ROOM:
//             const lastRoom = action.payload;
//             const roomIndex = groups.findIndex((group) => group.id === lastRoom.id);
//             if (roomIndex < 0) {
//                 groups.push(lastRoom);
//             } else {
//                 groups[roomIndex] = action.payload;
//             }

//             return {
//                 ...state,
//                 groups: groups,
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case DELETE_ROOM:
//             const prevIndex = groups.findIndex((item) => item.id === action.payload);
//             groups.splice(prevIndex, 1);
//             return {
//                 ...state,
//                 groups: groups,
//                 currentGroup: action.payload === currentGroup.id ? null : currentGroup,
//                 isLoaded: true,
//                 isLoading: false,
//                 isDeleted: true,
//             };
//         case UPDATE_ROOM:
//             return {
//                 ...state,
//                 groups: groups.map((v) => {
//                     if (v.id === action.payload.id) return { ...v, ...action.payload.data };
//                     else return v;
//                 }),
//                 currentGroup: { ...currentGroup, ...action.payload.data },
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case CURRENT_GROUP:
//             return {
//                 ...state,
//                 currentGroup: action.payload,
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case SET_CHAT_ROOM_MESSAGES:
//             return {
//                 ...state,
//                 messages: action.payload?.messages,
//                 // messages: action.payload?.messages?.sort((a, b) => {
//                 //     // console.log('created_at', a.created_at);
//                 //     return new Date(a.created_at?._seconds * 1000) > new Date(b.created_at?._seconds * 1000);
//                 // }),
//                 total: action.payload.total,
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case ADD_CHAT_ROOM_MESSAGE:
//             const lastMesage = action.payload[0];
//             const index = messages.findIndex((message) => message.id === lastMesage.id);
//             if (index < 0) {
//                 messages.push(lastMesage);
//             }
//             return {
//                 ...state,
//                 messages: messages,
//                 // messages: action.payload?.messages?.sort((a, b) => {
//                 //     // console.log('created_at', a.created_at);
//                 //     return new Date(a.created_at?._seconds * 1000) > new Date(b.created_at?._seconds * 1000);
//                 // }),
//                 total: action.payload.total,
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case SET_UESR_CHAT_ROOMS:
//             return {
//                 ...state,
//                 groups: action.payload,
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case DELETE_MEMBERS:
//             const { roomId, users } = action.payload;
//             return {
//                 ...state,
//                 groups: groups.map((room) => {
//                     if (room.id === roomId) {
//                         room.members = room.members.filter((member) => users.indexOf(member) < 0);
//                     }
//                     return room;
//                 }),
//                 currentGroup: {
//                     ...currentGroup,
//                     members: currentGroup.members.filter((member) => users.indexOf(member.uid) < 0),
//                 },
//                 isLoaded: true,
//                 isLoading: false,
//             };

//         case SET_PUBLIC_FORUM:
//             return {
//                 ...state,
//                 publicForums: action.payload,
//                 isLoaded: true,
//                 isLoading: false,
//             };

//         case TOGGLE_MEMBER_PUBLIC_FORUM:
//             return {
//                 ...state,
//                 groups: groups
//                     .map((room, i) => {
//                         if (room.id === action.payload.roomId) {
//                             room.members = action.payload.members;
//                         }
//                         return room;
//                     })
//                     .filter((room) => room.members.length > 0),
//                 publicForums: publicForums
//                     .map((room, i) => {
//                         if (room.id === action.payload.roomId) {
//                             room.members = action.payload.members;
//                         }
//                         return room;
//                     })
//                     .filter((room) => room.members.length > 0),
//                 currentGroup:
//                     action.payload.members.length > 0
//                         ? {
//                               ...currentGroup,
//                               members: action.payload.members,
//                           }
//                         : null,
//                 isLoaded: true,
//                 isLoading: false,
//                 isDeleted: true,
//             };
//         case POLL_UPDATE:
//             return {
//                 ...state,
//                 messages: messages.map((v) => {
//                     if (v.id === action.payload.id) return { ...v, poll: action.payload.poll };
//                     else return v;
//                 }),
//                 isLoaded: true,
//                 isLoading: false,
//             };
//         case RESET_HISTORY:
//             return {
//                 messages: [],
//                 groups: [],
//                 publicForums: [],
//                 currentGroup: null,
//                 error: null,
//                 isLoaded: false,
//                 isLoading: false,
//                 isDeleted: false,
//                 isUpdated: false,
//             };
//         default:
//             return state;
//     }
// };

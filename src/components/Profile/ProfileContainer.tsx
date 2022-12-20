import React, {FC} from 'react';
import Profile from "./Profile";
import {PostsType, ProfilePageType, ProfileType} from "../redux/store";
import axios from "axios";
import {AppStateType} from "../redux/redux-store";
import {connect} from "react-redux";
import {compose} from "redux";
import {setUserProfile} from "../redux/profile-reducer";
import {RouteComponentProps, withRouter} from "react-router-dom";

type PathParamsType = {
    userId: string
}

type MapStatePropsType = {
    posts: PostsType[]
    newPostText: string
    profile: ProfileType
}

type MapDispatchPropsType = {
    setUserProfile: (profile: ProfileType) => void
}

type ProfileContainerPropsType = /*RouteComponentProps<PathParamsType> &*/ /*ProfilePageType*/
    MapStatePropsType
    & MapDispatchPropsType;

type NewProfileContainerPropsType = RouteComponentProps<PathParamsType> & ProfileContainerPropsType;

class ProfileContainer extends React.Component<NewProfileContainerPropsType /*ProfileContainerPropsType*/> {

    componentDidMount() {
        let userId = this.props.match.params.userId
        if (!userId) {
            //мой id '26879' //this.props.profile.userId.toString(); <=== это потом понадобится!!!!!! и работает видимо что бы получить свой id с сервера когда залогинен!!!!!!!
            userId = this.props.profile.userId.toString();
        }
        console.log(userId)
        axios.get(`https://social-network.samuraijs.com/api/1.0/profile/${userId}`)
            .then(response => {
                this.props.setUserProfile(response.data)
            })
        console.log(this.props.profile )
    }

    render() {
        return (
            <div>
                <Profile
                    {...this.props}
                    posts={this.props.posts}
                    newPostText={this.props.newPostText}
                    profile={this.props.profile}
                />
            </div>
        )
    }
};

const mapStateToProps = (state: AppStateType): MapStatePropsType => {
    return {
        posts: state.profilePage.posts,
        newPostText: state.profilePage.newPostText,
        profile: state.profilePage.profile
    }
}

export default compose<FC>(connect(mapStateToProps, {setUserProfile}), withRouter)(ProfileContainer)

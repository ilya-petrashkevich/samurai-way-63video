import React, {ComponentType, FC} from 'react';
import {
    follow,
    unfollow,
    InitialStateType,
    setCurrentPage,
    setUsers,
    setUsersTotalCount,
    toggleIsFetching,
    UserType, toggleFollowingProgress
} from '../redux/users-reducer';
import {connect} from 'react-redux';
import {AppStateType} from '../redux/redux-store';
import {compose} from 'redux';
import axios from 'axios/index';
import Users from './Users';
import Preloader from "../common/Preloader/Preloader";
import {usersAPI} from "../../api/api";

type MapStatePropsType = {
    usersPage: InitialStateType
    pageSize: number
    totalUsersCount: number
    currentPage: number
    isFetching: boolean
    followingInProgress: number[]
    // toggleFollowingProgress: boolean
}

type MapDispatchPropsType = {
    follow: (userId: number) => void
    unfollow: (userId: number) => void
    setUsers: (users: UserType[]) => void
    setCurrentPage: (pageNumber: number) => void
    setUsersTotalCount: (totalCount: number) => void
    toggleIsFetching: (isFetching: boolean) => void
    toggleFollowingProgress: (isFetching: boolean) => void
}

export type UsersPropsType = MapStatePropsType & MapDispatchPropsType;

class UsersContainer extends React.Component<UsersPropsType> {

    componentDidMount() {
        this.props.toggleIsFetching(true);

        usersAPI.getUsers(this.props.currentPage, this.props.pageSize).then(/*response*/ data => {
            this.props.toggleIsFetching(false);
            this.props.setUsers(data.items) /*response.items*/
            this.props.setUsersTotalCount(data.totalCount) /*response.totalCount*/
        });
    }

    onPageChanged = (pageNumber: number) => {
        this.props.setCurrentPage(pageNumber);
        this.props.toggleIsFetching(true);

        usersAPI.getUsers(pageNumber, this.props.pageSize).then(/*response*/ data => {
            this.props.toggleIsFetching(false);
            this.props.setUsers(data.items) /*response.items*/
        })
    }

    render() {


        return <>
            {this.props.isFetching
                ?
                <Preloader/>
                :
                null}

            <Users
                totalUsersCount={this.props.totalUsersCount}
                pageSize={this.props.pageSize}
                currentPage={this.props.currentPage}
                onPageChanged={this.onPageChanged}
                users={this.props.usersPage.users}
                follow={this.props.follow}
                unfollow={this.props.unfollow}
                followingInProgress={this.props.followingInProgress}
                toggleFollowingProgress={this.props.toggleFollowingProgress}
            />
        </>
    }
}

const mapStateToProps = (state: AppStateType): MapStatePropsType => {
    return {
        usersPage: state.usersPage,
        pageSize: state.usersPage.pageSize,
        totalUsersCount: state.usersPage.totalUsersCount,
        currentPage: state.usersPage.currentPage,
        isFetching: state.usersPage.isFetching,
        followingInProgress: state.usersPage.followingInProgress
    }
}
export default compose<FC>(
    connect(mapStateToProps, /*mapDispatchToProps*/{
        follow,
        unfollow,
        setUsers,
        setCurrentPage,
        setUsersTotalCount,
        toggleIsFetching,
        toggleFollowingProgress
    })
)(UsersContainer)


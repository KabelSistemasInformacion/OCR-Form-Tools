// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from "react";
import {FontIcon} from "@fluentui/react";
import {constants} from "../../../common/constants";
import axios from 'axios';
import "./statusBar.scss";
import { IProject } from "../../../models/applicationState";
import { getAPIVersion } from "../../../common/utils";
export interface IStatusBarProps {
    project: IProject;
}
interface IStatusBarState {
    commitHash?: string;
}
export class StatusBar extends React.Component<IStatusBarProps, IStatusBarState> {
    componentDidMount() {
        const commitInfoUrl = require("../../../git-commit-info.txt");
        axios.get(commitInfoUrl).then(res => {
            // match the git commit hash
            const commitHash = /commit ([0-9a-fA-F]{7})/.exec(res?.data)[1];
            this.setState({ commitHash: commitHash || "" });
        });
    }


// export class StatusBar extends React.Component<IStatusBarProps> {
    public render() {
        const apiVersion = getAPIVersion(this.props.project?.apiVersion);
        return (
            <div className="status-bar">
                <div className="status-bar-main">{this.props.children}</div>
                <div className="status-bar-version">
                    <ul>
                        <li>
                            <a href="https://www.kabel.es" target="blank" rel="noopener noreferrer">Kabel</a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

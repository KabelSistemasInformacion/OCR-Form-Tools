// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { MouseEvent } from "react";
import { FontIcon, IconButton } from "office-ui-fabric-react";
import { ITag, ILabel, FieldType, FieldFormat, FormattedItem, NamedItem } from "../../../../models/applicationState";
import { strings } from "../../../../common/strings";
import TagInputItemLabel from "./tagInputItemLabel";
import { tagIndexKeys } from "./tagIndexKeys";

export interface ITagClickProps {
    ctrlKey?: boolean;
    altKey?: boolean;
    keyClick?: boolean;
    clickedColor?: boolean;
    clickedDropDown?: boolean;
}

/**
 * Properties for tag input item
 */
export interface ITagInputItemProps {
    /** Tag represented by item */
    tag: ITag;
    /** Index of tag within tags array */
    index: number;
    /** Labels owned by the tag */
    labels: ILabel[];
    /** Tag is currently renaming */
    isRenaming: boolean;
    /** Tag is currently locked for application */
    isLocked: boolean;
    /** Tag is currently selected */
    isSelected: boolean;
    /** Tag is currently applied to one of the selected regions */
    appliedToSelectedRegions: boolean;
    /** Function to call upon clicking item */
    onClick: (props: ITagClickProps) => void;
    /** Apply new name to tag */
    onRename: (newName: string, cancelCallback: () => void) => void;
    cancelRename: () => void;
    onLabelEnter: (label: ILabel) => void;
    onLabelLeave: (label: ILabel) => void;
    onTagChanged?: (oldTag: ITag, newTag: ITag) => void;
}

export interface ITagInputItemState {
    // /** Tag is currently renaming */
    // isRenaming: boolean;
}

export default class TagInputItem extends React.Component<ITagInputItemProps, ITagInputItemState> {

    // public state: ITagInputItemState = {
    //     isRenaming: false,
    // };

    private itemRef = React.createRef<HTMLDivElement>();
    private inputElement: HTMLInputElement;

    // public componentDidUpdate(prevProps: ITagInputItemProps) {
    //     if (prevProps.isRenaming !== this.props.isRenaming) {
    //         this.setState({
    //             isRenaming: this.props.isRenaming,
    //         });
    //     }
    // }

    public render() {
        const style: any = {
            background: this.props.tag.color,
        };

        return (
            <div className={"tag-item-block"}>
                <div
                    className={"tag-color"}
                    style={style}
                    onClick={onColorClick.bind(this, this.props.onClick)}>
                </div>
                <div className={"tag-item-block-2"}>
                    {
                        this.props.tag &&
                        <div
                            ref={this.itemRef}
                            className={this.getItemClassName()}
                            style={style}>
                            <div
                                className={"tag-content pr-2"}
                                onClick={onNameClick.bind(this, this.props.onClick)}>
                                {getFormattedEditorContent(
                                    this.props.tag,
                                    this.getDisplayIndex(),
                                    this.handleMouseEnter,
                                    this.handleMouseLeave,
                                    this.onInputRef,
                                    this.props.isRenaming,
                                    // this.state.isRenaming,
                                    this.onInputBlur,
                                    onDropdownClick.bind(this, this.props.onClick),
                                    this.onInputKeyDown,
                                )}
                            </div>
                            {
                                this.props.isLocked &&
                                <div></div>
                            }
                        </div>
                    }
                    {this.renderTagDetail()}
                </div>
            </div>
        );
    }

    public getTagNameRef() {
        return this.itemRef;
    }

    private getItemClassName = () => {
        const classNames = ["tag-item"];
        if (this.props.isSelected) {
            classNames.push("tag-item-selected");
        }
        if (this.props.appliedToSelectedRegions) {
            classNames.push("tag-item-applied");
        }
        return classNames.join(" ");
    }

    private renderTagDetail = () => {
        return this.props.labels.map((label, idx) =>
            <TagInputItemLabel
                key={idx}
                label={label}
                onLabelEnter={this.props.onLabelEnter}
                onLabelLeave={this.props.onLabelLeave}
            />);
    }

    private onInputRef = (element: HTMLInputElement) => {
        this.inputElement = element;
        if (element) {
            element.select();
        }
    }

    private onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.onRenameTag();
    }

    private onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            this.inputElement.blur();
        } else if (e.key === "Escape") {
            this.props.cancelRename();
        }
    }

    private onRenameTag() {
        if (!this.inputElement) {
            return;
        }
        const name = this.inputElement.value.trim();
        this.props.onRename(name, () => {
            // this.setState({
            //     isRenaming: false,
            // });
        });
    }


    private getDisplayIndex = () => {
        const index = this.props.index;
        if (index >= 0 && index < tagIndexKeys.length) {
            return tagIndexKeys[index];
        }
        return null;
    }

    private handleMouseEnter = () => {
        const { labels } = this.props;
        if (labels.length > 0) {
            this.props.onLabelEnter(labels[0]);
        }
    }

    private handleMouseLeave = () => {
        const { labels } = this.props;
        if (labels.length > 0) {
            this.props.onLabelLeave(labels[0]);
        }
    }
}

// TODO turn into a component proper
export const getFormattedEditorContent = (
    item: FormattedItem,
    displayIndex: string,
    handleMouseEnter: any,
    handleMouseLeave: any,
    inputRef: any,
    isRenaming: boolean,
    onInputBlur: any,
    onDropdownClick: any,
    onInputKeyDown: any,
) => {
    return (
        <div className={"tag-name-container"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {
                (isTypeOrFormatSpecified(item)) &&
                <FontIcon iconName="Link" className="pl-1" />
            }
            <div className="tag-name-body">
                {
                    isRenaming
                    ?
                    <input
                        ref={inputRef}
                        className={`tag-name-editor ${getFormattedContentClassName(item)}`}
                        type="text"
                        defaultValue={item.name}
                        onKeyDown={(e) => onInputKeyDown(e)}
                        onBlur={onInputBlur}
                        autoFocus={true}
                    />
                    :
                    <span title={item.name} className={getFormattedContentClassName(item)}>
                        {item.name}
                    </span>
                }
            </div>
            <div className={"tag-icons-container"}>
                {(displayIndex !== null)
                    ?
                    <span className="tag-index-span border border-white rounded-sm ">{displayIndex}</span>
                    :
                    <span className="tag-index-span"></span>
                }
                <IconButton
                    title={strings.tags.toolbar.contextualMenu}
                    ariaLabel={strings.tags.toolbar.contextualMenu}
                    className="tag-input-toolbar-iconbutton ml-2"
                    iconProps={{iconName: "ChevronDown"}}
                    onClick={onDropdownClick} />
            </div>
        </div>
    );
}

export const onDropdownClick = (onClick: any, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const clickedDropDown = true;
    onClick({ clickedDropDown });
}

export const onColorClick = (onClick: any, e: MouseEvent) => {
    e.stopPropagation();

    const ctrlKey = e.ctrlKey || e.metaKey;
    const altKey = e.altKey;
    const clickedColor = true;
    onClick({ ctrlKey, altKey, clickedColor });
}

export const onNameClick = (onClick: any, e: MouseEvent) => {
    e.stopPropagation();

    const ctrlKey = e.ctrlKey || e.metaKey;
    const altKey = e.altKey;
    onClick({ ctrlKey, altKey });
}

export const getFormattedContentClassName = (item: FormattedItem) => {
    const classNames = ["tag-name-text px-2 pb-1"];
    if (isTypeOrFormatSpecified(item)) {
        classNames.push("tag-name-text-typed");
    }
    return classNames.join(" ");
}

export const isTypeOrFormatSpecified = (item: FormattedItem) => {
    return (item.type && item.type !== FieldType.String) ||
        (item.format && item.format !== FieldFormat.NotSpecified);
}


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { projectEmailConfigurationSelector, updateProjectEmailConfig } from 'controllers/project';
import { activeProjectRoleSelector, userAccountRoleSelector } from 'controllers/user';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { canConfigreEmailNotifications } from 'common/utils/permissions';
import { EmailToggle, EmailCasesList } from './forms/index';
import styles from './notificationsTab.scss';

const cx = classNames.bind(styles);

@connect(
  (state) => ({
    emailConfiguration: projectEmailConfigurationSelector(state),
    projectRole: activeProjectRoleSelector(state),
    userRole: userAccountRoleSelector(state),
  }),
  { update: updateProjectEmailConfig },
)
export class NotificationsTab extends Component {
  static propTypes = {
    emailConfiguration: PropTypes.object,
    update: PropTypes.func,
    onSubmit: PropTypes.func,
    showModal: PropTypes.func,
    projectRole: PropTypes.string,
    userRole: PropTypes.string,
  };
  static defaultProps = {
    emailConfiguration: {},
    update: () => {},
    onSubmit: () => {},
    showModal: () => {},
    projectRole: '',
    userRole: '',
  };
  submitForm = (data = {}) => {
    const { update, emailConfiguration } = this.props;
    update({ ...emailConfiguration, ...data });
  };

  isAbleToEditForm = () =>
    canConfigreEmailNotifications(this.props.userRole, this.props.projectRole);
  render() {
    const {
      emailConfiguration: { emailCases, emailEnabled },
    } = this.props;
    const readOnly = !this.isAbleToEditForm();

    return (
      <div className={cx('notification-form')}>
        <EmailToggle
          initialValues={{ emailEnabled }}
          onSubmit={this.submitForm}
          readOnly={readOnly}
        />
        {emailEnabled && (
          <EmailCasesList
            emailCases={emailCases}
            onSubmit={this.submitForm}
            configurable={readOnly}
          />
        )}
      </div>
    );
  }
}
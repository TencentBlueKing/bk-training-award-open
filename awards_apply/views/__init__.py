# flake8:noqa
from awards_apply.views.approval import ApprovalView
from awards_apply.views.award_view import (AvailableAwardsView, AwardView,
                                           RecordView, get_application_by_id,
                                           get_award_by_id, home)
from awards_apply.views.file_handle import download, upload  # noqa
from awards_apply.views.group_view import (GroupManageView, GroupUserView,
                                           GroupView, GroupAllView)
from awards_apply.views.message_view import MessageView
from awards_apply.views.secretary import SecretaryViewSet  # noqa
from awards_apply.views.user import UserInfoView, UserView

from awards_apply.views.award_view import ApplyedRecordView  # noqa; noqa
from awards_apply.views.award_view import finish_award, award_application  # noqa; noqa

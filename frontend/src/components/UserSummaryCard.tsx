import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

const UserSummaryCard = ({
  user,
  appliedCount,
}: {
  user: any;
  appliedCount: number;
}) => {
  return (
    <div className="mx-3 mt-3 mb-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Top section */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
          <Avatar
            src={
              user?.profileImageUrl
                ? `http://localhost:8080${user.profileImageUrl}`
                : undefined
            }
            icon={!user?.profileImageUrl && <UserOutlined /> }
          />
        </div>

        <div>
          <div className="text-sm font-medium text-slate-900">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-slate-500">{user.email}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-slate-100" />

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <div className="text-slate-500">Applications</div>
        <div className="font-medium text-slate-900">{appliedCount}</div>
      </div>
    </div>
  );
};

export default UserSummaryCard;

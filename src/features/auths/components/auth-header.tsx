import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AuthHeaderProps {
  type: "signup" | "signin" | "forgot-password" | "reset-password";
  children: React.ReactNode;
}

const AuthHeader = ({ type, children }: AuthHeaderProps) => {
  let title = "";
  let desc = "";

  switch (type) {
    case "signup":
      title = "สมัครสมาชิก";
      desc = "กรุณากรอกข้อมูลเพื่อสมัครสมาชิก";
      break;
    case "signin":
      title = "เข้าสู่ระบบ";
      desc = "กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ";
      break;
    case "forgot-password":
      title = "ลืมรหัสผ่าน";
      desc = "กรุณากรอกอีเมลล์เพื่อรีเซ็ตรหัสผ่าน";
      break;
    case "reset-password":
      title = "รีเซ็ตรหัสผ่าน";
      desc = "กรุณากรอกรหัสผ่านใหม่";
      break;
  }

  return (
    <div className="px-4 md:px-0">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-center">{desc}</CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};
export default AuthHeader;

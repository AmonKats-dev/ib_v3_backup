PASSWORD_RESET_TEMPLATE = """Dear $user_fullname, $new_line $new_line
Your password has been reset. $new_line
Your new password is: $password  $new_line $new_line
Sincerely,  $new_line
IBP Team"""


USER_CREATE_TEMPLATE = """<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                Dear $full_name,
            </p>
            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your account has been created. You can access with the following credentials: </p>
            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                Username: <b>$username</b>
                <br />
                Password: <b>$password</b>
            </p>
            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                You can access it by following <a href="$link" target="_blank">this link</a>
            </p>

            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your administration team</p>
"""

using System.Net.Mail;

namespace Anytime.Phone.Extensions
{
    public static class StringExtensions
    {
        public static string NullIfEmpty(this string s)
        {
            return string.IsNullOrEmpty(s) ? null : s;
        }

        public static string NullIfWhiteSpace(this string s)
        {
            return string.IsNullOrWhiteSpace(s) ? null : s;
        }

        public static bool IsDigitsOnly(this string inputString)
        {
            foreach (char c in inputString)
            {
                if (c == ' ')
                    continue;

                if (!char.IsDigit(c))
                    return false;
            }

            return true;
        }

        public static bool IsValidEmail(this string email)
        {
            if (email == null)
                return false;

            email = email.Trim();


            if (email.Contains(" "))
                return false;


            MailAddress ma;

            try
            {
                ma = new MailAddress(email);

                var ary = email.Split('@');
                var domain = ary[1];

                if (!domain.Contains(".") || domain.EndsWith(".") || domain.Contains(".."))
                    ma = null;
            }
            catch
            {
                ma = null;
            }

            if (ma == null)
                return false;

            return true;
        }

        public static string TrimQuotes(this string input)
        {
            if (input.StartsWith("\"") && input.EndsWith("\""))
                return input[1..^1];

            return input;
        }

        public static string CapitalizeFirstLetterOnly(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            if (input.Length == 1)
                return char.ToUpper(input[0]).ToString();

            return char.ToUpper(input[0]) + input.Substring(1).ToLower();
        }
    }
}

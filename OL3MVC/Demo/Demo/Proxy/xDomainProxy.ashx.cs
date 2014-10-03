using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace Demo.Proxy
{

    /// <summary>
    /// Summary description for xDomainProxy
    /// </summary>
    public class xDomainProxy : IHttpHandler
    {

 
        public void ProcessRequest(HttpContext context)
        {

            string requestUrl = System.Web.HttpUtility.UrlDecode(context.Request.Url.Query.Replace("?url=", ""));
            string username = string.Empty;
            string password = string.Empty;

            // deterime request method
            if (context.Request.HttpMethod == "GET")
            {
                // get username, pass from query string
                username = context.Request.Params["username"];
                password = context.Request.Params["password"];

            }
            else if (context.Request.HttpMethod == "POST")
            {
                var data = context.Request.Form;
                username = data["username"];
                password = data["password"];
               
            }

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(requestUrl);
            // Set some reasonable limits on resources used by this request
            request.MaximumAutomaticRedirections = 4;
            request.MaximumResponseHeadersLength = 4;

            // Set credentials to use for this request.
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
            {
                request.Credentials = GetCredential(requestUrl, username, password);
            }

            System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse();


            // Get the stream associated with the response.
            Stream receiveStream = response.GetResponseStream();

            // Pipes the stream to a higher level stream reader with the required encoding format. 
            StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8);


            Console.WriteLine("Response stream received.");

            //string wtf = readStream.ReadToEnd();

            CopyStream(readStream.BaseStream, context.Response.OutputStream);
            context.Response.End();

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }


        public void CopyStream(System.IO.Stream input, System.IO.Stream output)
        {
            var buffer = new byte[1024];
            int bytes;
            while ((bytes = input.Read(buffer, 0, 1024)) > 0)
                output.Write(buffer, 0, bytes);
        }

        public static CredentialCache GetCredential(string url, string username, string password)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3;
            CredentialCache credentialCache = new CredentialCache();
            credentialCache.Add(new System.Uri(url), "Basic", new NetworkCredential(username, password));
            return credentialCache;
        }
        
    }
}
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

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

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(requestUrl);

            System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse();

            CopyStream(response.GetResponseStream(), context.Response.OutputStream);
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
        
    }
}
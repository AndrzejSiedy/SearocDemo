using System.Web;
using System.Web.Optimization;

namespace Demo
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        // knockoutJs
                        "~/Scripts/knockout-{version}.js",
                        "~/Scripts/sammy-{version}.js",
                        // configure sammy to show/hide views in SPA maner
                        // it is a place where we initiate GNX app after DOM gets rendered first time
                        "~/Scripts/app/routes.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Customized jQuery UI
            bundles.Add(new ScriptBundle("~/bundles/jQueryUi").Include(
                        "~/Scripts/jquery-ui-1.11.1.custom/jquery-ui.js"));

            bundles.Add(new StyleBundle("~/bundles/jqueryUiCss").Include(
                        "~/Scripts/jquery-ui-1.11.1.custom/jquery-ui.css"));

            bundles.Add(new ScriptBundle("~/bundles/OpenLayers2").Include(
                        "~/Scripts/2.13.1/OpenLayers.js"));


            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            // Gnx modules
            bundles.Add(new ScriptBundle("~/app/Gnx").Include(
                    "~/Scripts/app/Utils/Utils.js",
                    "~/Scripts/app/Setup/Init.js",
                    "~/Scripts/app/Utils/Event.js",
                    "~/Scripts/app/Views/Layout.js",
                    "~/Scripts/app/Views/Center.js",
                    "~/Scripts/app/Views/West.js",
                    "~/Scripts/app/Modules/OpenLayers.js",
                    "~/Scripts/app/Modules/koWmsLayers.js",
                    "~/Scripts/app/AppLogic.js"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = true;
        }
    }
}

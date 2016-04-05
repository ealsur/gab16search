using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace gab16search
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddTransient<ISearchService>(provider =>
                 new SearchService("ealsur","6605083F07CF62B49FCA9515D8CB8C9A")         
            );
            services.AddCaching();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseDeveloperExceptionPage();
            
            app.UseIISPlatformHandler();

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "mastercontrol",
                    template: "master/{action}",
                    defaults: new {controller="Master", action="Index" });
                routes.MapRoute(
                    name: "search",
                    template: "search/{action}",
                    defaults: new {controller="Search", action="Search"});
                routes.MapRoute(
                    name: "default",
                    template: "",
                    defaults: new {controller="Home", action="Index"});
                routes.MapRoute(
                    name: "steps",
                    template: "{id}",
                    defaults: new {controller="Home", action="Step"});
                
            });
        }

        public static void Main(string[] args) => Microsoft.AspNet.Hosting.WebApplication.Run<Startup>(args);
    }
}

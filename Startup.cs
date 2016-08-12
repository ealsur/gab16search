using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;

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
            services.AddMvc().AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());
            services.AddTransient<ISearchService>(provider =>
                 new SearchService("ealsur","7E557A152E266D91F4359795772B3379")         
            );
            services.AddTransient<IStorageService>(provider =>
                 new StorageService(Configuration["storage"])          
            );
            services.AddMemoryCache();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseDeveloperExceptionPage();
            
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

         public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
				.UseIISIntegration()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }
    }
}

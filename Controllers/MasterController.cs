using System;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Azure; // Namespace for CloudConfigurationManager 
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Queue; // Namespace for Queue storage types

namespace gab16search.Controllers
{
    public class MasterController : Controller
    {
        private IMemoryCache cache;
        private IStorageService storageService;
        private MemoryCacheEntryOptions cacheOptions;
        public MasterController(IMemoryCache cache, IStorageService storageService){
            this.cache = cache;
            this.cacheOptions = new MemoryCacheEntryOptions(){SlidingExpiration = TimeSpan.FromHours(1)};
            this.storageService = storageService;
        }
        public IActionResult Index()
        {
            this.cache.Set("session", 1, this.cacheOptions);
            return View();
        }       
        
        public IActionResult GetCurrent()
        {
            var current = this.cache.Get("session");
            return Json(new {current=current});
        }
        [HttpPost]
        public IActionResult SetCurrent([FromBody]int id)
        {
            this.cache.Set("session", id, this.cacheOptions);
            return Ok();
        }
        
        [HttpPost]
        public IActionResult Twitter(string account)
        {
            storageService.Enqueue(account);
            return Ok();
        }
    }
}

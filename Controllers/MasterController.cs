using System;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace gab16search.Controllers
{
    public class MasterController : Controller
    {
        private IMemoryCache cache;
        private MemoryCacheEntryOptions cacheOptions;
        public MasterController(IMemoryCache cache){
            this.cache = cache;
            this.cacheOptions = new MemoryCacheEntryOptions(){SlidingExpiration = TimeSpan.FromHours(1)};
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
    }
}

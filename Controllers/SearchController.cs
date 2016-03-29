using gab16search.ViewModels;
using Microsoft.AspNet.Mvc;

namespace gab16search.Controllers
{
    public class SearchController : Controller
    {
        private ISearchService _searchService;
        public SearchController(ISearchService searchService)
        {
            _searchService = searchService;
        }
        [HttpPost]
        public IActionResult Search([FromBody]SearchPayload payload)
        {
            return Json(_searchService.Search(payload));
        }
        
        [HttpGet]
        public IActionResult Suggest(string term, bool fuzzy = true)
        {
            var response = _searchService.Suggest(term, fuzzy); 
            return Json(response);  
        }
    }
}

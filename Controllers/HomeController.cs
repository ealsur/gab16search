using Microsoft.AspNetCore.Mvc;

namespace gab16search.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        
        public IActionResult Step(string id)
        {
            return PartialView(id);
        }
    }
}

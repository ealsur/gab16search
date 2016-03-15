
using Microsoft.Azure.Search;

public interface ISearchService
{
    
}

public class SearchService:ISearchService
{
    private SearchServiceClient client;
    public SearchService(string searchAccount, string searchKey){
        client = new SearchServiceClient(searchAccount, new SearchCredentials(searchKey));        
    }
    
        
}
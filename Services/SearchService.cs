
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Newtonsoft.Json;

public interface ISearchService
{
    string Search(string searchText,SearchParameters sp);
}

public class SearchService:ISearchService
{
    private SearchServiceClient client;
    private SearchIndexClient indexClient;
    public SearchService(string searchAccount, string searchKey){
        client = new SearchServiceClient(searchAccount, new SearchCredentials(searchKey));     
        indexClient = client.Indexes.GetClient("movies");   
    }    
    public string Search(string searchText, SearchParameters sp){
        return JsonConvert.SerializeObject(indexClient.Documents.Search(searchText, sp));
    }        
}
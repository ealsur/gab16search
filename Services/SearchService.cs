
using System.Collections.Generic;
using System.Linq;
using gab16search.ViewModels;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Newtonsoft.Json;

public interface ISearchService
{
    DocumentSearchResult Search(SearchPayload payload);
}

public class SearchService:ISearchService
{
    private SearchServiceClient client;
    private SearchIndexClient indexClient;
    public SearchService(string searchAccount, string searchKey){
        client = new SearchServiceClient(searchAccount, new SearchCredentials(searchKey));     
        indexClient = client.Indexes.GetClient("movies");   
    }    
    public DocumentSearchResult Search(SearchPayload payload){
        var sp = new SearchParameters();
        sp.Top = payload.PageSize;
        sp.Skip = (payload.Page - 1) * payload.PageSize;
        if(payload.Filters!=null){
            sp.Filter = string.Join(",", payload.Filters.Select(x=>string.Format("{0} eq {1}", x.Key, NeedsStringDelimiter(x.Value)?string.Format("'{0}'",x.Value):x.Value)).ToArray());
        }
        sp.OrderBy = payload.OrderBy.Split(',');
        sp.QueryType = payload.QueryType;
        sp.SearchMode = payload.SearchMode;
        if(!string.IsNullOrEmpty(payload.ScoringProfile)){
            sp.ScoringProfile = payload.ScoringProfile;    
        }        
        sp.IncludeTotalResultCount = true;
        if(payload.IncludeFacets){
            /* FACETS FOR APPLIED FILTERS ARE NOT REQUIRED */
            var appliedFilters = new List<string>();
            if(payload.Filters!=null){
                 appliedFilters = payload.Filters.Select(x=>x.Key).ToList();
            }
            sp.Facets = (new List<string>(){"year", "rtAllCriticsRating", "actorTags", "genreTags"}).Except(appliedFilters).ToList();
        }
        return indexClient.Documents.Search(payload.Text, sp);
    }
    
    private bool NeedsStringDelimiter(string value){
        int i;
        if(int.TryParse(value, out i)){
            return false;
        }
        double d;
        if(double.TryParse(value, out d)){
            return false;
        }
        return true;
    }     
}
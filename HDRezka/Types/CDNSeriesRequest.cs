namespace HDRezka.Types
{
    public class CDNSeriesRequest : SeasonsRequest
    {
        public int? Season { get; set; }

        public int? Episode { get; set; }
    }
}

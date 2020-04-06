using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HDRezka
{
    public class Media
    {
        public int Id { get; set; }
                
        public int? TranslationId { get; set; }

        public int? Season { get; set; }

        public int? Episode { get; set; }

        public CDNStream[] CDNStreams { get; set; }
    }
}
